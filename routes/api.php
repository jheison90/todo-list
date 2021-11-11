<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiControllers\UsuarioController;
use App\Http\Controllers\ApiControllers\TareaController;
use App\Http\Controllers\ApiControllers\SubTareaController;
use App\Http\Controllers\ApiControllers\CategoriaController;
use App\Http\Controllers\Auth\AuthApiController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
| 
*/



Route::post('/login', [AuthApiController::class, 'login']);


Route::apiResource('usuario', UsuarioController::class);    
Route::middleware('auth:sanctum')->group(function ()
{
    Route::get('usuario/{id}/tarea/finalizado', [TareaController::class,'listaFinalizados']);
    Route::apiResource('usuario.tarea', TareaController::class);   
    Route::apiResource('usuario.categoria', CategoriaController::class);
    
    Route::apiResource('categoria.tarea', TareaController::class);
    
    Route::apiResource('tarea', TareaController::class);    
    Route::put('tarea/{id}/finalizar', [TareaController::class,'finalizar']);
    Route::get('tarea/{id}/categoria', [TareaController::class,'busquedaPorCategoria']);
    Route::get('/buscar-tarea', [TareaController::class,'busquedaAutoCompletar']);
    
    
    Route::apiResource('tarea.sub_tarea', SubTareaController::class);    
    Route::apiResource('sub_tarea', SubTareaController::class);  
    Route::put('sub_tarea/{id}/finalizar', [SubTareaController::class,'finalizar']);  
    # code...
});
