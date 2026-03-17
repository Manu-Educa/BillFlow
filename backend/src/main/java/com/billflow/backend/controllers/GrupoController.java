package com.billflow.backend.controllers;

import com.billflow.backend.models.Grupo;
import com.billflow.backend.repositories.GrupoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/grupos")
public class GrupoController {

    @Autowired
    private GrupoRepository grupoRepository;

    @GetMapping
    public List<Grupo> obtenerTodos() {
        return grupoRepository.findAll();
    }

    @PostMapping
    public Grupo crearGrupo(@RequestBody Grupo nuevoGrupo) {
        return grupoRepository.save(nuevoGrupo);
    }

    @PutMapping("/{id}")
    public Grupo actualizarGrupo(@PathVariable Long id, @RequestBody Grupo grupoActualizado) {
        grupoActualizado.setId(id);
        return grupoRepository.save(grupoActualizado);
    }

    @DeleteMapping("/{id}")
    public void eliminarGrupo(@PathVariable Long id) {
        grupoRepository.deleteById(id);
    }
}