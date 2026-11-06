<?php

namespace App\Http\Controllers;

use App\Models\Nota;
use Illuminate\Http\Request;

class NotaController extends Controller
{
    public function index()
    {
        return Nota::orderByDesc('id')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'titulo' => 'required|string|max:100',
            'contenido' => 'nullable|string|max:500',
        ]);

        return response()->json(Nota::create($data), 201);
    }

    public function destroy(Nota $nota)
    {
        $nota->delete();
        return response()->noContent();
    }
}