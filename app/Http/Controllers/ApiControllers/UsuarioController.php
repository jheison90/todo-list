<?php

namespace App\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Usuario;

class UsuarioController extends Controller
{

    /**
     * Obtener la lista de usuarios
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Usuario::All();
    }


    /**
     * Obtiene los datos de un usuario especifico
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    public function show($id)
    {
        $usuario = Usuario::find($id);

        return response($usuario, 200);
    }


    /**
     * Guardar un nuevo usuario
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function store(Request $request)
    {

        /**
         * Validar datos ingresado
         * Inicialmente solo se requiere el nombre de la tarea
         */
        $validated = $request->validate([
            'nombre' => 'required|max:45',
            'email' => 'required|email|unique:usuario|max:50',
            'password' => 'required',
        ]);

        /**
         * Registrar Usuario
         */

        $usuario = Usuario::create([

            'nombre' => $request->nombre,
            'email' => $request->email,
            'password' => Hash::make($request->password)

        ]);

        return response($usuario, 200);
    }

    /**
     * Actualiza un usuario especifica.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    public function update(Request $request, $id)
    {


        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response('Usuario no encontrado', 400);
        }

        $usuario->nombre = $request->nombre;
        $usuario->save();

        return response($usuario, 200);
    }

    /**
     * Eliminar un usuario especifico
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    public function destroy($id)
    {
        $usuario = Usuario::find($id);
        $usuario->delete();
        return response($usuario, 200);
    }
}
