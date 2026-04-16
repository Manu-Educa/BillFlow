package com.billflow.backend.repositories;
import com.billflow.backend.models.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {}