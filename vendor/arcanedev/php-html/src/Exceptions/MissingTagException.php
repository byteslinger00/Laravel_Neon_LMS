<?php

declare(strict_types=1);

namespace Arcanedev\Html\Exceptions;

/**
 * Class     MissingTagException
 *
 * @author   ARCANEDEV <arcanedev.maroc@gmail.com>
 */
class MissingTagException extends \Exception
{
    /* -----------------------------------------------------------------
     |  Main Methods
     | -----------------------------------------------------------------
     */

    /**
     * @param  string  $className
     *
     * @return static
     */
    public static function onClass($className)
    {
        return new self("Class {$className} has no `\$tag` property or empty.");
    }
}
