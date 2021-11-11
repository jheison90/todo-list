<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'nombre',
        'usuario_id'        
    ];

    /**
     * Nombre de la tabla
     */
    protected $table = 'categoria';

    /**
     * Obtener la tarea asociada al usuario.
     */
    public function tarea()
    {
        return $this->hasMany('App\Models\Tarea');
    }

    /**
     * Obtener el usuario asociado a la categoria.
     */
    public function usuario()
    {
        return $this->belongsTo('App\Models\Usuario');
    }
}
