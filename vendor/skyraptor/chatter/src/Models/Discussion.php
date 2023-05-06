<?php

namespace SkyRaptor\Chatter\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Config;

class Discussion extends Model
{
    use SoftDeletes;
    
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'chatter_discussion';

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'chatter_category_id',
        'user_id',
        'slug',
        'color'
    ];

    protected $dates = [
        'deleted_at',
        'last_reply_at'
    ];

    public function user()
    {
        return $this->belongsTo(Config::get('chatter.user.namespace'));
    }

    public function category()
    {
        return $this->belongsTo(Config::get('chatter.models.category', Category::class), 'chatter_category_id');
    }

    public function posts()
    {
        return $this->hasMany(Config::get('chatter.models.post', Post::class), 'chatter_discussion_id');
    }

    public function post()
    {
        return $this->hasMany(Config::get('chatter.models.post', Post::class), 'chatter_discussion_id')->orderBy('created_at', 'ASC');
    }

    public function postsCount()
    {
        return $this->posts()
        ->selectRaw('chatter_discussion_id, count(*)-1 as total')
        ->groupBy('chatter_discussion_id');
    }

    public function users()
    {
        return $this->belongsToMany(Config::get('chatter.user.namespace'), 'chatter_user_discussion', 'discussion_id', 'user_id');
    }
}
