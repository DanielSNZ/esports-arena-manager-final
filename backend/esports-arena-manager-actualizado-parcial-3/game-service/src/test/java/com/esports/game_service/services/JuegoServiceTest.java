package com.esports.game_service.services;

import com.esports.game_service.exceptions.JuegoException;
import com.esports.game_service.models.Juego;
import com.esports.game_service.models.dtos.JuegoDTO;
import com.esports.game_service.repositories.JuegoRepository;
import net.datafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class JuegoServiceTest {

    @Mock
    private JuegoRepository juegoRepository;

    @InjectMocks
    private JuegoServiceImpl juegoService;

    private Juego juegoPrueba;
    private JuegoDTO juegoDTO;
    private List<Juego> juegoList;

    @BeforeEach
    public void setUp() {
        juegoPrueba = new Juego();
        juegoPrueba.setJuegoId(1L);
        juegoPrueba.setNombre("Counter Strike 2");
        juegoPrueba.setGenero("Shooter");
        juegoPrueba.setModalidad("5v5");
        juegoPrueba.setJugadoresPorEquipo(5);
        juegoPrueba.setEstado("ACTIVO");

        juegoDTO = new JuegoDTO();
        juegoDTO.setNombre("Counter Strike 2");
        juegoDTO.setGenero("Shooter");
        juegoDTO.setModalidad("5v5");
        juegoDTO.setJugadoresPorEquipo(5);
        juegoDTO.setEstado("ACTIVO");

        juegoList = new ArrayList<>();

        Faker faker = new Faker(Locale.of("es", "CL"));

        for (int i = 0; i < 100; i++) {
            Juego juego = new Juego();
            juego.setJuegoId((long) i + 2);
            juego.setNombre(faker.esports().game());
            juego.setGenero("Shooter");
            juego.setModalidad("5v5");
            juego.setJugadoresPorEquipo(5);
            juego.setEstado("ACTIVO");

            juegoList.add(juego);
        }

        juegoList.add(juegoPrueba);
    }

    @Test
    @DisplayName("Debe listar todos los juegos")
    public void shouldFindAllJuegos() {
        when(juegoRepository.findAll()).thenReturn(juegoList);

        List<Juego> result = juegoService.findAll();

        assertThat(result).hasSize(101);
        assertThat(result).contains(juegoPrueba);
        verify(juegoRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Debe buscar juego por ID")
    public void shouldFindJuegoById() {
        Long id = 1L;
        when(juegoRepository.findById(id)).thenReturn(Optional.of(juegoPrueba));

        Juego result = juegoService.findById(id);

        assertThat(result).isNotNull();
        assertThat(result.getJuegoId()).isEqualTo(1L);
        assertThat(result.getNombre()).isEqualTo("Counter Strike 2");
        verify(juegoRepository, times(1)).findById(id);
    }

    @Test
    @DisplayName("Debe lanzar excepción al buscar juego inexistente")
    public void shouldNotFindJuegoById() {
        Long id = 999L;
        when(juegoRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> juegoService.findById(id))
                .isInstanceOf(JuegoException.class)
                .hasMessage("Juego no encontrado");

        verify(juegoRepository, times(1)).findById(id);
    }

    @Test
    @DisplayName("Debe guardar un juego nuevo")
    public void shouldSaveJuego() {
        when(juegoRepository.save(any(Juego.class))).thenReturn(juegoPrueba);

        Juego result = juegoService.save(juegoDTO);

        assertThat(result).isNotNull();
        assertThat(result.getNombre()).isEqualTo("Counter Strike 2");
        assertThat(result.getEstado()).isEqualTo("ACTIVO");
        verify(juegoRepository, times(1)).save(any(Juego.class));
    }

    @Test
    @DisplayName("Debe actualizar juego existente")
    public void shouldUpdateJuegoById() {
        Long id = 1L;

        JuegoDTO cambios = new JuegoDTO();
        cambios.setNombre("Valorant");
        cambios.setGenero("Shooter táctico");
        cambios.setModalidad("5v5");
        cambios.setJugadoresPorEquipo(5);
        cambios.setEstado("ACTIVO");

        when(juegoRepository.findById(id)).thenReturn(Optional.of(juegoPrueba));
        when(juegoRepository.save(any(Juego.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Juego result = juegoService.updateById(id, cambios);

        assertThat(result.getNombre()).isEqualTo("Valorant");
        assertThat(result.getGenero()).isEqualTo("Shooter táctico");
        assertThat(result.getJugadoresPorEquipo()).isEqualTo(5);

        verify(juegoRepository, times(1)).findById(id);
        verify(juegoRepository, times(1)).save(juegoPrueba);
    }

    @Test
    @DisplayName("Debe lanzar excepción al actualizar juego inexistente")
    public void shouldNotUpdateJuegoWhenNotExists() {
        Long id = 999L;
        when(juegoRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> juegoService.updateById(id, juegoDTO))
                .isInstanceOf(JuegoException.class)
                .hasMessage("Juego no encontrado");

        verify(juegoRepository, times(1)).findById(id);
        verify(juegoRepository, never()).save(any(Juego.class));
    }

    @Test
    @DisplayName("Debe eliminar juego existente")
    public void shouldDeleteJuegoById() {
        Long id = 1L;
        when(juegoRepository.existsById(id)).thenReturn(true);

        juegoService.deleteById(id);

        verify(juegoRepository, times(1)).existsById(id);
        verify(juegoRepository, times(1)).deleteById(id);
    }

    @Test
    @DisplayName("Debe lanzar excepción al eliminar juego inexistente")
    public void shouldNotDeleteJuegoWhenNotExists() {
        Long id = 999L;
        when(juegoRepository.existsById(id)).thenReturn(false);

        assertThatThrownBy(() -> juegoService.deleteById(id))
                .isInstanceOf(JuegoException.class)
                .hasMessage("Juego no encontrado");

        verify(juegoRepository, times(1)).existsById(id);
        verify(juegoRepository, never()).deleteById(id);
    }
}
