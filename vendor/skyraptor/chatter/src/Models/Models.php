<?php
/**
 * Created by PhpStorm.
 * User: stefan
 * Date: 07-09-16
 * Time: 11:58.
 */

namespace SkyRaptor\Chatter\Models;

use Illuminate\Support\Facades\Config;

class Models
{
    /**
     * Map for the models.
     *
     * @var array
     */
    protected static $models = [];

    /**
     * Get an instance of the category model.
     *
     * @param array $attributes
     *
     * @return \SkyRaptor\Chatter\Models\Category
     */
    public static function category(array $attributes = [])
    {
        return self::makeModel(Config::get('chatter.models.category'), $attributes);
    }

    /**
     * Get an instance of the discussion model.
     *
     * @param array $attributes
     *
     * @return \SkyRaptor\Chatter\Models\Discussion
     */
    public static function discussion(array $attributes = [])
    {
        return self::makeModel(Config::get('chatter.models.discussion'), $attributes);
    }

    /**
     * Get an instance of the post model.
     *
     * @param array $attributes
     *
     * @return \SkyRaptor\Chatter\Models\Post
     */
    public static function post(array $attributes = [])
    {
        return self::makeModel(Config::get('chatter.models.post'), $attributes);
    }

    /**
     * Get an instance of the given model.
     *
     * @param string $model
     * @param array  $attributes
     *
     * @return \Illuminate\Database\Eloquent\Model
     */
    protected static function makeModel($model, $attributes)
    {
        return new $model($attributes);
    }
}
