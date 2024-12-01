<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\Product;
use App\Models\Cart;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $cart = $user->cart->items()->get();

        if (!$cart) {
            return response()->json(['message' => 'No cart found for this user'], 404);
        }

        return response()->json($cart);
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

        // Create the cart item
        $cartItem = $cart->items()->create([
            'product_id' => $product->id,
            'quantity' => $request->quantity,
            'price' => $product->price * $request->quantity,
        ]);

        return response()->json($cartItem, 201);
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
            return response()->json(['message' => 'No cart found for this user'], 404);
        }

        $cart->cartItems()->delete();
        return response()->json(['message' => 'All items have been removed from the cart'], 200);
    }
}
