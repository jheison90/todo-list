<?php

/**
 * Codigo que retorna los datos del usuario autenticado y el token de acceso para
 * realizar solicitudes API
 */

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\Usuario;

class AuthApiController extends Controller
{
    public function login(Request $request)
    {

        /**
         * Validar los campos email y password
         */
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()
                ->json(['message' => 'Unauthorized'], 401);
        }

        $user = Usuario::where('email', $request['email'])->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        /**
         * Retorna los datos de usuario y token para ser administrados en el frontend en cada solicitud al backend.
         */
        return response(['data' => $user, 'access_token' => $token, 'token_type' => 'Bearer',]);
    }
}
