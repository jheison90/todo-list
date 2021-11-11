<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'nombre',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'fecha_verificacion_email' => 'datetime',
    ];

    /**
     * Nombre de la tabla
     */

    protected $table = 'usuario';

    /**
     * Obtener la tarea asociada al usuario.
     */
    public function tarea()
    {
        return $this->hasMany('App\Models\Tarea');
    }
    /**
     * Obtener las categorias asociada al usuario.
     */
    public function categorias()
    {
        return $this->hasMany('App\Models\Categoria');
    }
}
