
<?php

use App\Http\Controllers\SubscriptionController;

// Subscription routes
$router->group(['prefix' => 'subscription', 'middleware' => 'auth'], function () use ($router) {
    // Get current subscription details
    $router->get('/show', 'SubscriptionController@show');
    
    // Get available plans
    $router->get('/plans', 'SubscriptionController@plans');
    
    // Get payment history
    $router->get('/payment-history', 'SubscriptionController@paymentHistory');
    
    // Change subscription plan
    $router->post('/change-plan', 'SubscriptionController@changePlan');
    
    // Renew subscription
    $router->post('/renew', 'SubscriptionController@renew');
});
