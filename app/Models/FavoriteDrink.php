<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FavoriteDrink extends Model
{
    use HasFactory;

    protected $table = 'favorite_drinks';
    protected $fillable = ['user_id', 'name', 'description', 'caffeine'];

    public function user() {
        return $this->belongsTo(User::class, "user_id");
    }

    public static function generateDefaultDrinks($userId)
    {
        $drinks = [
            [
                "name" => "Monster UltraSunrise",
                "description" => "A refreshing orange beverage that has 75mg of caffeine per serving. Every can has two servings.",
                "caffeine" => 75,
                "user_id" => $userId
            ],
            [
                "name" => "Black Coffee",
                "description" => "The classic, the average 8oz. serving of black coffee has 95mg of caffeine.",
                "caffeine" => 95,
                "user_id" => $userId
            ],
            [
                "name" => "Americano",
                "description" => "Sometimes you need to water it down a bit... and in comes the americano with an average of 77mg. of caffeine per serving.",
                "caffeine" => 77,
                "user_id" => $userId
            ],
            [
                "name" => "Sugar free NOS",
                "description" => "Another orange delight without the sugar. It has 130 mg. per serving and each can has two servings.",
                "caffeine" => 65,
                "user_id" => $userId
            ],
            [
                "name" => "5 Hour Energy",
                "description" => "And amazing shot of get up and go! Each 2 fl. oz. container has 200mg of caffeine to get you going.",
                "caffeine" => 200,
                "user_id" => $userId
            ]            
        ];
        self::insert($drinks);
    }
}
