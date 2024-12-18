<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\Product;
use App\Models\Cart;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        // Get the user's cart or create a new one
        $cart = $user->cart ?: Cart::create(['user_id' => $user->id]);

        // Load items with product details
        $cart->load('items.product');

        // Format the response
        $cartItems = $cart->items->map(function ($item) {
            return [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'name' => $item->product->name,
                'price' => $item->price,
                'quantity' => $item->quantity,
            ];
        });

        return response()->json(['items' => $cartItems]);
    }



    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $product = Product::find($request->product_id);

        if ($product->quantity < $request->quantity) {
            return response()->json(['message' => 'Not enough stock available'], 400);
        }

        $cart = $user->cart ?: Cart::create(['user_id' => $user->id]);
        $existingItem = $cart->items()->where('product_id', $product->id)->first();

        // Check if item exists in cart
        if ($existingItem) {
            // If the product is already in the cart, update the quantity instead
            $existingItem->quantity += $request->quantity;
            $existingItem->price = $product->price; 
            $existingItem->save();
            return response()->json($existingItem, 200);
        } else {
            // Create a new cart item
            $cartItem = $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $request->quantity,
                'price' => $product->price,
            ]);
            return response()->json($cartItem, 201);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $itemId)
    {
        $user = Auth::user();
        $cartItem = $user->cart->items()->findOrFail($itemId);

        return response()->json($cartItem);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $itemId)
    {
        $user = Auth::user();
        $cartItem = $user->cart->items()->findOrFail($itemId);

        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $cartItem->update(['quantity' => $request->quantity]);

        return response()->json($cartItem);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $itemId)
    {
        $user = Auth::user();
        $cartItem = $user->cart->items()->findOrFail($itemId);

        $cartItem->delete();

        return response()->json(null, 204);
    }

    public function deleteAllItems()
    {
        $user = Auth::user();
        $cart = $user->cart;

        if (!$cart) {
            return response()->json(['message' => 'No cart found for this user.'], 404);
        }

        $cart->load('items.product');

        if ($cart->items->isEmpty()) {
            return response()->json(['message' => 'Cart is empty.'], 404);
        }

        DB::beginTransaction();

        foreach ($cart->items as $item) {
            $product = $item->product;

            if ($product) {
                if ($product->quantity >= $item->quantity) {
                    $product->decrement('quantity', $item->quantity);
                } else {
                    DB::rollBack();
                    return response()->json([
                        'message' => "Product {$product->name} does not have enough stock."
                    ], 400);
                }
            }
        }

        $cart->items()->delete();
        DB::commit();

        return response()->json(['message' => 'All items have been removed from the cart, and product stock has been updated.'], 200);
    }

    public function catalog() {
        $products = Product::all();
        return response()->json($products);
    }
}
