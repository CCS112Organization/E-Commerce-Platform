<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::all(); // Retrieve all products
        return response()->json($products); // Return as JSON
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
        $request->validate([
            'barcode' => 'required|unique:products|max:255',
            'name' => 'required|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'quantity' => 'required|integer',
            'category' => 'required|max:255',
        ]);

        $product = Product::create($request->all()); // Create the product
        return response()->json($product, 201); // Return created product with status 201
    }

    /**
     * Display the specified resource.
     */
    public function show(string $barcode)
    {
        $product = Product::where('barcode', $barcode)->firstOrFail(); // Find product by barcode
        return response()->json($product); // Return as JSON
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
    public function update(Request $request, string $barcode)
    {
        $request->validate([
            'barcode' => 'required|max:255|unique:products,barcode,' . $barcode . ',barcode',
            'name' => 'required|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'quantity' => 'required|integer',
            'category' => 'required|max:255',
        ]);

        $product = Product::where('barcode', $barcode)->firstOrFail(); // Find product by barcode
        $product->update($request->all()); // Update the product
        return response()->json($product); // Return updated product
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $barcode)
    {
        $product = Product::where('barcode', $barcode)->firstOrFail(); // Find product by barcode
        $product->delete(); // Delete the product
        return response()->json(null, 204); // Return no content status
    }
}
