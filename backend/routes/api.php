<?php

use App\Http\Controllers\NotaController;
use Illuminate\Support\Facades\Route;

Route::get('/notas', [NotaController::class, 'index']);
Route::post('/notas', [NotaController::class, 'store']);
Route::delete('/notas/{nota}', [NotaController::class, 'destroy']);