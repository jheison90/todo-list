<?php

namespace App\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tarea;
use App\Models\Categoria;

class TareaController extends Controller
{
    /**
     * Obtener la lista de tareas relacionadas a una categoria
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id)
    {

        $tarea = Tarea::where('categoria_id', $id)->where('finalizado', false)->orderBy('created_at', 'desc')->get();
        return response($tarea, 200);
    }

    /**
     * Obtener la lista de tareas relacionadas a una categoria
     *
     * @return \Illuminate\Http\Response
     */
    public function listaFinalizados($id)
    {

        
        $tarea = Tarea::where('finalizado', true)->where('usuario_id',$id)->orderBy('created_at', 'desc')->get();
        
        return response($tarea, 200);
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
     * Guardar una nueva tarea/actividad relacionada auna categoria y usuario
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {


        $categoria = $request->categoria_id;
        if ($categoria < 0) {
            $sinCategoria = Categoria::where('usuario_id', $request->usuario_id)->where('nombre', 'Sin Categoria')->get();

            if (!count($sinCategoria)) {
                $cat = Categoria::create([
                    'id'=>0,
                    'nombre' => 'Sin Categoria',
                    'usuario_id' => $request->usuario_id
                ]);

                $categoria = $cat->id;
            } else {
                $categoria = $sinCategoria[0]['id'];
            }
        }
        /**
         * Validar datos ingresado
         * Inicialmente solo se requiere el nombre de la tarea
         */
        $validated = $request->validate([
            'nombre' => 'required|max:100',
            'categoria_id' => 'required',
            'usuario_id' => 'required',
        ]);

        /**
         * Registrar datos
         */
        $tarea = Tarea::create([

            'nombre' => $request->nombre,
            'descripcion' => null,
            'fecha_finalizacion' => null,
            'categoria_id' => $categoria,
            'usuario_id' => $request->usuario_id

        ]);

        return response($tarea, 200);
    }

    /**
     * Obtiene los datos de una tarea especifica
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $tarea = Tarea::find($id);
        return response($tarea, 200);
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
     * Actualiza una tarea especifica.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {


        $tarea = Tarea::find($id);

        if (!$tarea) {
            return response('Tarea no encontrada', 400);
        }

        /**
         * Dar formato a la fecha de finalizacion
         */
        $fecha = date_create($request->fecha_finalizacion);
        date_time_set($fecha, 00, 00);


        /**
         * Validar datos ingresado
         */
        $validated = $request->validate([
            'nombre' => 'required|max:100',
            'descripcion' => 'max:100',
            'fecha_finalizacion' => 'date'
        ]);

        /**
         * Registrar datos
         */
        $tarea->nombre =  $request->nombre;
        $tarea->descripcion = $request->descripcion;
        $tarea->fecha_finalizacion = $fecha;

        $tarea->save();

        return response($tarea);
    }

    /**
     * Eliminar una tarea especifica
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $tarea = Tarea::find($id);

        if (!$tarea) {
            return response('Tarea no encontrada', 400);
        }

        $tarea->delete();
        return $tarea;
    }


    /**
     * Termina una tarea especifica
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function finalizar($id)
    {
        $tarea = Tarea::find($id);

        if (!$tarea) {
            return response('Tarea no encontrada', 400);
        }

        /**
         * Marcar finalizado = true si la tarea se finalizó
         */
        if ($tarea->finalizado) {
            $tarea->finalizado = !$tarea->finalizado;
        } else {
            $tarea->finalizado = !$tarea->finalizado;
        }

        $tarea->save();

        return response($tarea, 200);
    }


    /**
     * Busca tareas por su nombre o descripción
     *
     * @param  string  $palabraClave
     * @return \Illuminate\Http\Request
     */
    public function busquedaAutoCompletar(Request $request)
    {
        $query = $request->get('query');
        $usuario_id = $request->get('id');
        $tareas = Tarea::where('nombre', 'LIKE', '%' . $query . '%')->orWhere('descripcion', 'LIKE', '%' . $query . '%')->where('usuario_id', $usuario_id)->get();
        return response($tareas, 200);
    }
}
