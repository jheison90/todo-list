<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubTarea extends Model
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
        'finalizado',
        'tarea_id'
    ];

    protected $table = 'sub_tarea';

     /**
     * Obtener la tarea asociada a la sub tarea.
     */
    public function tarea()
    {
        return $this->belongsTo('App\Tarea');
    }
}
