<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Save;
use App\Models\Store;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(60)->create();
        Store::factory(30)->create();
        Category::factory(10)->create();
        Product::factory(40)->create();
        Save::factory(20)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
