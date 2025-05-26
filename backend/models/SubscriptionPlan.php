
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubscriptionPlan extends Model
{
    protected $fillable = [
        'name',
        'description',
        'price',
        'currency',
        'duration_days',
        'features',
        'is_popular',
        'is_active'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'duration_days' => 'integer',
        'features' => 'json',
        'is_popular' => 'boolean',
        'is_active' => 'boolean'
    ];

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class, 'plan_id');
    }

    public function orderHistories(): HasMany
    {
        return $this->hasMany(OrderHistory::class, 'plan_id');
    }
}
