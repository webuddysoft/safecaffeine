<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Resources\DrinkCollection;
use App\Models\FavoriteDrink;

class DrinkController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        return response()->json($user->drinks);
    }

    public function save()
    {
        $user = Auth::user();
        
        $data = request()->all();
        $drink = null;
        if (!$data['id']) 
            $drink = new FavoriteDrink;
        else
            $drink = FavoriteDrink::find($data['id']);
        if (!$drink) {
            return response(["message" => "Invalid Request!"], 400);
        }
        //Check name duplication
        $sDrink = FavoriteDrink::where('name', $data['name'])->where('id', '!=', $data['id'])->count();
        if ($sDrink > 0) {
            return response(["message" => "The drink name already exists."], 400);
        }

        $drink->fill($data);
        $drink->user_id = $user->id;
        $drink->save();

        return response()->json(["id" => $drink->id, "list" => $user->drinks]);
    }

    public function delete($id)
    {
        $user = Auth::user();
        $drink = FavoriteDrink::find($id);
        if (!$drink) {
            return response(["message" => "Invalid Request!"], 400);
        }
        $drink->delete();
        
        return response()->json(["list" => $user->drinks]);
    }
}
