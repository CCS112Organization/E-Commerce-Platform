<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Product extends Model
{
    use HasFactory, HasApiTokens;
    //

    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';

    public function getRouteKeyName()
    {
        return 'barcode';
    }

    protected $fillable = [
        'barcode',
        'name',
        'description',
        'price',
        'quantity',
        'category',
    ];
}
