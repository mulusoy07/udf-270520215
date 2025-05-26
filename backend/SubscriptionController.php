
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\User;
use App\Models\Subscription;
use App\Models\OrderHistory;
use App\Models\SubscriptionPlan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    /**
     * Get user's current subscription details
     */
    public function show(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Kullanıcı bulunamadı'
                ], 401);
            }

            // Get user with subscription and plan details
            $userWithSubscription = User::with(['subscription.plan'])
                ->find($user->id);

            if (!$userWithSubscription->subscription) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'has_subscription' => false,
                        'plan_name' => null,
                        'plan_price' => null,
                        'currency' => 'TL',
                        'expiry_date' => null,
                        'remaining_days' => 0,
                        'is_active' => false,
                        'features' => []
                    ]
                ]);
            }

            $subscription = $userWithSubscription->subscription;
            $plan = $subscription->plan;
            
            // Calculate remaining days
            $expiryDate = Carbon::parse($subscription->expiry_date);
            $remainingDays = max(0, $expiryDate->diffInDays(Carbon::now(), false) * -1);
            $isActive = $expiryDate->isFuture();

            return response()->json([
                'success' => true,
                'data' => [
                    'has_subscription' => true,
                    'plan_name' => $plan->name,
                    'plan_price' => $plan->price,
                    'currency' => $plan->currency ?? 'TL',
                    'expiry_date' => $subscription->expiry_date,
                    'remaining_days' => $remainingDays,
                    'is_active' => $isActive,
                    'features' => json_decode($plan->features, true) ?? []
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Abonelik bilgileri alınırken hata oluştu: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all available subscription plans
     */
    public function plans(): JsonResponse
    {
        try {
            $plans = SubscriptionPlan::where('is_active', true)
                ->orderBy('price', 'asc')
                ->get()
                ->map(function($plan) {
                    return [
                        'id' => $plan->id,
                        'name' => $plan->name,
                        'description' => $plan->description,
                        'price' => $plan->price,
                        'currency' => $plan->currency ?? 'TL',
                        'duration_days' => $plan->duration_days,
                        'features' => json_decode($plan->features, true) ?? [],
                        'is_popular' => $plan->is_popular ?? false
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $plans
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Planlar alınırken hata oluştu: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's payment history
     */
    public function paymentHistory(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Kullanıcı bulunamadı'
                ], 401);
            }

            $page = $request->get('page', 1);
            $limit = $request->get('limit', 10);

            $orders = OrderHistory::where('user_id', $user->id)
                ->with('plan')
                ->orderBy('created_at', 'desc')
                ->paginate($limit, ['*'], 'page', $page);

            $formattedOrders = $orders->getCollection()->map(function($order) {
                return [
                    'id' => $order->id,
                    'description' => $order->plan->name . ' - ' . Carbon::parse($order->created_at)->format('F Y'),
                    'plan_name' => $order->plan->name,
                    'date' => $order->created_at->format('Y-m-d'),
                    'amount' => $order->amount,
                    'currency' => $order->currency ?? 'TL',
                    'status' => $order->status,
                    'payment_method' => $order->payment_method
                ];
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'orders' => $formattedOrders,
                    'pagination' => [
                        'current_page' => $orders->currentPage(),
                        'last_page' => $orders->lastPage(),
                        'per_page' => $orders->perPage(),
                        'total' => $orders->total()
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ödeme geçmişi alınırken hata oluştu: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Change subscription plan
     */
    public function changePlan(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Kullanıcı bulunamadı'
                ], 401);
            }

            $request->validate([
                'plan_id' => 'required|exists:subscription_plans,id'
            ]);

            $newPlan = SubscriptionPlan::findOrFail($request->plan_id);

            DB::beginTransaction();

            try {
                // Get or create subscription
                $subscription = Subscription::firstOrCreate(
                    ['user_id' => $user->id],
                    [
                        'plan_id' => $newPlan->id,
                        'expiry_date' => Carbon::now()->addDays($newPlan->duration_days),
                        'is_active' => true
                    ]
                );

                // Update subscription if exists
                if (!$subscription->wasRecentlyCreated) {
                    $subscription->update([
                        'plan_id' => $newPlan->id,
                        'expiry_date' => Carbon::now()->addDays($newPlan->duration_days),
                        'is_active' => true
                    ]);
                }

                // Create order history record
                OrderHistory::create([
                    'user_id' => $user->id,
                    'plan_id' => $newPlan->id,
                    'amount' => $newPlan->price,
                    'currency' => $newPlan->currency ?? 'TL',
                    'status' => 'completed',
                    'payment_method' => 'plan_change'
                ]);

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Plan başarıyla değiştirildi'
                ]);

            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Plan değiştirme sırasında hata oluştu: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Renew current subscription
     */
    public function renew(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Kullanıcı bulunamadı'
                ], 401);
            }

            $subscription = Subscription::where('user_id', $user->id)
                ->with('plan')
                ->first();

            if (!$subscription) {
                return response()->json([
                    'success' => false,
                    'message' => 'Aktif abonelik bulunamadı'
                ], 404);
            }

            DB::beginTransaction();

            try {
                // Extend subscription
                $currentExpiry = Carbon::parse($subscription->expiry_date);
                $newExpiry = $currentExpiry->isFuture() 
                    ? $currentExpiry->addDays($subscription->plan->duration_days)
                    : Carbon::now()->addDays($subscription->plan->duration_days);

                $subscription->update([
                    'expiry_date' => $newExpiry,
                    'is_active' => true
                ]);

                // Create order history record
                OrderHistory::create([
                    'user_id' => $user->id,
                    'plan_id' => $subscription->plan->id,
                    'amount' => $subscription->plan->price,
                    'currency' => $subscription->plan->currency ?? 'TL',
                    'status' => 'completed',
                    'payment_method' => 'renewal'
                ]);

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Abonelik başarıyla yenilendi'
                ]);

            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Abonelik yenileme sırasında hata oluştu: ' . $e->getMessage()
            ], 500);
        }
    }
}
