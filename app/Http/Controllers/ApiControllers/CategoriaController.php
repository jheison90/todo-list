<?php

namespace App\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Categoria;
use App\Models\Usuario;
use App\Models\Tarea;

class CategoriaController extends Controller
{
    /**
     * Lista las categorias relacionadas creadas por un usuario
     * y la cantidad de tareas relacionadas a ellas.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id)
    {

        $usuario = Usuario::find($id);

        //validar si el usuario existe
        if (!$usuario) {
            return response('Usuario no encontrado', 400);
        }

        $categorias = $usuario->categorias;

        /**
         * Obtener el total de tareas/actividades relacionados a las categorias
         */
        foreach ($categorias as $categoria) {
            $totalTareas = Tarea::where('categoria_id', $categoria['id'])->where('finalizado', false)->count();
            $categoria['total_tareas'] = $totalTareas;
            
        }
        
        //Obtener la lista de tareas finalizadas
        
        $totalTareasInactivas = Tarea::where('usuario_id', $usuario->id)->where('finalizado', true)->count();
        $finalizados = [
            "id" => 0,
            "nombre" => 'Finalizados',
            "total_tareas" => $totalTareasInactivas
        ];
        
        $categorias[] = $finalizados;
      

        
        return response($categorias, 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Guardar una categoria nueva.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        /**
         * Validar datos ingresado
         */
        $validated = $request->validate([
            'nombre' => 'required|max:20',
            'usuario_id' => 'required',
        ]);

        /**
         * Registrar datos
         */
        $categoria = Categoria::create([
            'nombre' => $request->nombre,
            'usuario_id' => $request->usuario_id,
        ]);

        return response($categoria, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
