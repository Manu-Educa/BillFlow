package com.billflow.backend.controllers;
import com.billflow.backend.models.GastoFijo;
import com.billflow.backend.repositories.GastoFijoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/gastos-fijos") // Fíjate que en las URLs se suele usar guion en vez de mayúsculas
public class GastoFijoController {
    @Autowired private GastoFijoRepository gastoFijoRepository;
    @GetMapping public List<GastoFijo> obtenerTodos() { return gastoFijoRepository.findAll(); }
    @PostMapping
    public GastoFijo crearGastoFijo(@RequestBody GastoFijo nuevoGastoFijo) {
        return gastoFijoRepository.save(nuevoGastoFijo);
    }
    @PutMapping("/{id}")
    public GastoFijo actualizarGastoFijo(@PathVariable Long id, @RequestBody GastoFijo gastoFijoActualizada) {
        gastoFijoActualizada.setId(id);
        return gastoFijoRepository.save(gastoFijoActualizada);
    }

    @DeleteMapping("/{id}")
    public void eliminarGastoFijo(@PathVariable Long id) {
       gastoFijoRepository.deleteById(id);
    }
}