<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index(Request $request) 
    {
        $user = Auth::user();
        if (!$user) {
            return response("Unauthorized", 401);
        }
        return response()->json($user);
    }
    public function save()
    {
        $user = Auth::user();
        $caffeineLimit = floatval(request()->input("caffeineLimit", 0));
        if (!$caffeineLimit || $caffeineLimit <= 0) {
            return response(["message" => "Invalid Request!"], 400);
        }
        $user->caffeine_limit = $caffeineLimit;
        $user->save();
        return response()->json($user);
    }
}
