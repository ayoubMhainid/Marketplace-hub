<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Exception;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function addCategory(Request $request)
    {
        try {
            $categoryName = $request->input('categoryName');
            Category::create([
                "categoryName" => $categoryName,
            ]);
            return response()->json([
                'message' => 'Category created',
            ]);
        } catch (Exception $ex) {
            return response()->json([
                "message" => $ex->getMessage(),
            ], 500);
        }
    }

    public function viewCategories()
    {
        try {
            $categories = Category::all();
            if ($categories) {
                return response()->json([
                    "categories" => $categories
                ], 200);
            } else {
                return response()->json([
                    'message' => 'Catregory not found',
                ]);
            }
        } catch (Exception $ex) {
            return response()->json([
                'message' => $ex->getMessage(),
            ], 500);
        }
    }
}
