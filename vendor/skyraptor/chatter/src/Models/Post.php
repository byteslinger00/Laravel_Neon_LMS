<?php

namespace SkyRaptor\Chatter\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Config;

class Post extends Model
{
    use SoftDeletes;
    
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'chatter_post';

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
        'chatter_discussion_id', 
        'user_id', 
        'body', 
        'markdown'
    ];

    protected $dates = [
        'deleted_at'
    ];

    public function discussion()
    {
        return $this->belongsTo(Config::get('chatter.models.discussion', Discussion::class), 'chatter_discussion_id');
    }

    public function user()
    {
        return $this->belongsTo(Config::get('chatter.user.namespace'));
    }
}
