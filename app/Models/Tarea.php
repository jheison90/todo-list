<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tarea extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'nombre',
        'descripcion',
        'fecha_finalizacion',
        'finalizado',
        'categoria_id',
        'usuario_id'
    ];

    /**
     * Nombre de la tabla
     */
    protected $table = 'tarea';

    /**
     * Obtener el usuario asociado a la tarea.
     */
    public function usuario()
    {
        return $this->belongsTo('Usuario');
    }

    /**
     * Obtener la sub tarea asociada a la tarea.
     */
    public function subTarea()
    {
        return $this->hasMany('SubTarea');
    }

    /**
     * Obtener la categoria asociado a la tarea.
     */
    public function categoria()
    {
        return $this->belongsTo('App\Models\Categoria');
    }
}
