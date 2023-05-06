<?php

/**
 * Helpers.
 */

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Route;

// Route helper.
$route = function ($accessor, $default = '') {
    return Config::get('chatter.routes.' . $accessor, $default);
};

// Middleware helper.
$middleware = function ($accessor, $default = []) {
    return Config::get('chatter.middleware.' . $accessor, $default);
};

// Authentication middleware helper.
$authMiddleware = function ($accessor) use ($middleware) {
    return array_unique(
        array_merge((array) $middleware($accessor), ['auth'])
    );
};

/*
 * Chatter routes.
 */
Route::group([
    'as'         => 'chatter.',
    'prefix'     => $route('home'),
    'middleware' => $middleware('global', 'web'),
], function () use ($route, $middleware, $authMiddleware) {

    // Home view.
    Route::middleware($authMiddleware('home'))
    ->get('/', [Config::get('chatter.controllers.default'), 'index'])
    ->name('home');

    // Single category view.
    Route::middleware($authMiddleware('category.show'))
    ->get($route('category').'/{slug}', [Config::get('chatter.controllers.default'), 'index'])
    ->name('category.show');

    /*
     * Discussion routes.
     */
    Route::group([
        'as'     => 'discussion.',
        'prefix' => $route('discussion'),
    ], function () use ($middleware, $authMiddleware) {

        // All discussions view.
        Route::middleware($authMiddleware('discussion.index'))
        ->get('/', [Config::get('chatter.controllers.discussion'), 'index'])
        ->name('index');

        // Create discussion view.
        Route::middleware($authMiddleware('discussion.create'))
        ->get('create', [Config::get('chatter.controllers.discussion'), 'create'])
        ->name('create');

        // Store discussion action.
        Route::middleware($authMiddleware('discussion.store'))
        ->post('/', [Config::get('chatter.controllers.discussion'), 'store'])
        ->name('store');

        // Single discussion view.
        Route::middleware($authMiddleware('discussion.show'))
        ->get('{category}/{slug}', [Config::get('chatter.controllers.discussion'), 'show'])
        ->name('showInCategory');

        // Add user notification to discussion
        Route::post('{category}/{slug}/email', [Config::get('chatter.controllers.discussion'), 'toggleEmailNotification'])
        ->name('email');

        /*
         * Specific discussion routes.
         */
        Route::group([
            'prefix' => '{discussion}',
        ], function () use ($middleware, $authMiddleware) {

            // Single discussion view.
            Route::middleware($authMiddleware('discussion.show'))
            ->get('/', [Config::get('chatter.controllers.discussion'), 'show'])
            ->name('show');

            // Edit discussion view.
            Route::middleware($authMiddleware('discussion.edit'))
            ->get('edit', [Config::get('chatter.controllers.discussion'), 'edit'])
            ->name('edit');
            
            // Update discussion action.
            Route::middleware($authMiddleware('discussion.update'))
            ->match(['PUT', 'PATCH'], '/', [Config::get('chatter.controllers.discussion'), 'update'])
            ->name('update');
            
            // Destroy discussion action.
            Route::middleware($authMiddleware('discussion.destroy'))
            ->delete('/', [Config::get('chatter.controllers.discussion'), 'destroy'])
            ->name('destroy');
        });
    });

    /*
     * Post routes.
     */
    Route::group([
        'as'     => 'posts.',
        'prefix' => $route('post', 'posts'),
    ], function () use ($middleware, $authMiddleware) {

        // All posts view.
        Route::middleware($authMiddleware('post.index'))
        ->get('/', [Config::get('chatter.controllers.post'), 'index'])
        ->name('index');

        // Create post view.
        Route::middleware($authMiddleware('post.create'))
        ->get('create', [Config::get('chatter.controllers.post'), 'create'])
        ->name('create');

        // Store post action.
        Route::middleware($authMiddleware('post.store'))
        ->post('/', [Config::get('chatter.controllers.post'), 'store'])
        ->name('store');

        /*
         * Specific post routes.
         */
        Route::group([
            'prefix' => '{post}',
        ], function () use ($middleware, $authMiddleware) {

            // Update post action.
            Route::middleware($authMiddleware('post.update'))
            ->match(['PUT', 'PATCH'], '/', [Config::get('chatter.controllers.post'), 'update'])
            ->name('update');

            // Destroy post action.
            Route::middleware($authMiddleware('post.destroy'))
            ->delete('/', [Config::get('chatter.controllers.post'), 'destroy'])
            ->name('destroy');
        });
    });
});

/*
 * Atom routes
 */
Route::middleware($authMiddleware('home'))
->get($route('home').'.atom', [Config::get('chatter.controllers.atom'), 'index'])
->name('chatter.atom');
