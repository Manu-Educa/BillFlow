package com.billflow.backend.controllers;

import com.billflow.backend.models.Usuario;
import com.billflow.backend.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public List<Usuario> obtenerTodosLosUsuarios() {
        return usuarioRepository.findAll();
    }
    @PostMapping
    public Usuario crearUsuario(@RequestBody Usuario nuevoUsuario) {
        return usuarioRepository.save(nuevoUsuario);
    }

    @PutMapping("/{id}")
    public Usuario actualizarPresupuesto(@PathVariable Long id, @RequestBody Usuario usuarioActualizado) {
        usuarioActualizado.setId(id);
        return usuarioRepository.save(usuarioActualizado);
    }

    @DeleteMapping("/{id}")
    public void eliminarGrupo(@PathVariable Long id) {
        usuarioRepository.deleteById(id);
    }
}
