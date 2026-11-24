package com.esports.sanction_service.services;

import com.esports.sanction_service.clients.UserClient;
import com.esports.sanction_service.exceptions.SancionException;
import com.esports.sanction_service.models.Sancion;
import com.esports.sanction_service.models.dtos.SancionDTO;
import com.esports.sanction_service.models.dtos.UserResponseDTO;
import com.esports.sanction_service.repositories.SancionRepository;
import net.datafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SancionServiceTest {

    @Mock
    private SancionRepository sancionRepository;

    @Mock
    private UserClient userClient;

    @InjectMocks
    private SancionServiceImpl sancionService;

    private Sancion sancionPrueba;
    private SancionDTO sancionDTO;
    private UserResponseDTO usuarioActivo;
    private UserResponseDTO usuarioInactivo;
    private List<Sancion> sancionList;

    @BeforeEach
    public void setUp() {
        sancionPrueba = new Sancion();
        sancionPrueba.setSancionId(1L);
        sancionPrueba.setUsuarioId(1L);
        sancionPrueba.setMotivo("Conducta antideportiva");
        sancionPrueba.setTipo("SUSPENSION");
        sancionPrueba.setFechaInicio(LocalDateTime.of(2026, 6, 20, 10, 0));
        sancionPrueba.setFechaFin(LocalDateTime.of(2026, 6, 25, 10, 0));
        sancionPrueba.setEstado("ACTIVA");

        sancionDTO = new SancionDTO();
        sancionDTO.setUsuarioId(1L);
        sancionDTO.setMotivo("Conducta antideportiva");
        sancionDTO.setTipo("SUSPENSION");
        sancionDTO.setFechaInicio(LocalDateTime.of(2026, 6, 20, 10, 0));
        sancionDTO.setFechaFin(LocalDateTime.of(2026, 6, 25, 10, 0));
        sancionDTO.setEstado("ACTIVA");

        usuarioActivo = new UserResponseDTO();
        usuarioActivo.setUsuarioId(1L);
        usuarioActivo.setNombre("Daniel");
        usuarioActivo.setNickname("danielsaa");
        usuarioActivo.setEmail("daniel@gmail.com");
        usuarioActivo.setRol("JUGADOR");
        usuarioActivo.setEstado("ACTIVO");

        usuarioInactivo = new UserResponseDTO();
        usuarioInactivo.setUsuarioId(2L);
        usuarioInactivo.setNombre("Usuario Inactivo");
        usuarioInactivo.setNickname("inactivo");
        usuarioInactivo.setEmail("inactivo@gmail.com");
        usuarioInactivo.setRol("JUGADOR");
        usuarioInactivo.setEstado("INACTIVO");

        sancionList = new ArrayList<>();
        Faker faker = new Faker(Locale.of("es", "CL"));

        for (int i = 0; i < 100; i++) {
            Sancion sancion = new Sancion();
            sancion.setSancionId((long) i + 2);
            sancion.setUsuarioId(1L);
            sancion.setMotivo(faker.lorem().sentence());
            sancion.setTipo("SUSPENSION");
            sancion.setFechaInicio(LocalDateTime.of(2026, 6, 20, 10, 0));
            sancion.setFechaFin(LocalDateTime.of(2026, 6, 25, 10, 0));
            sancion.setEstado("ACTIVA");
            sancionList.add(sancion);
        }

        sancionList.add(sancionPrueba);
    }

    @Test
    @DisplayName("Debe listar todas las sanciones")
    public void shouldFindAllSanciones() {
        when(sancionRepository.findAll()).thenReturn(sancionList);

        List<Sancion> result = sancionService.findAll();

        assertThat(result).hasSize(101);
        assertThat(result).contains(sancionPrueba);
        verify(sancionRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Debe buscar sanción por ID")
    public void shouldFindSancionById() {
        Long id = 1L;
        when(sancionRepository.findById(id)).thenReturn(Optional.of(sancionPrueba));

        Sancion result = sancionService.findById(id);

        assertThat(result).isNotNull();
        assertThat(result.getSancionId()).isEqualTo(1L);
        assertThat(result.getTipo()).isEqualTo("SUSPENSION");
        verify(sancionRepository, times(1)).findById(id);
    }

    @Test
    @DisplayName("Debe lanzar excepción al buscar sanción inexistente")
    public void shouldNotFindSancionById() {
        Long id = 999L;
        when(sancionRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> sancionService.findById(id))
                .isInstanceOf(SancionException.class)
                .hasMessage("Sanción no encontrada");

        verify(sancionRepository, times(1)).findById(id);
    }

    @Test
    @DisplayName("Debe buscar sanciones por usuarioId")
    public void shouldFindSancionesByUsuarioId() {
        Long usuarioId = 1L;
        when(sancionRepository.findByUsuarioId(usuarioId)).thenReturn(sancionList);

        List<Sancion> result = sancionService.findByUsuarioId(usuarioId);

        assertThat(result).hasSize(101);
        assertThat(result.get(0).getUsuarioId()).isEqualTo(usuarioId);
        verify(sancionRepository, times(1)).findByUsuarioId(usuarioId);
    }

    @Test
    @DisplayName("Debe buscar sanciones por tipo")
    public void shouldFindSancionesByTipo() {
        String tipo = "SUSPENSION";
        when(sancionRepository.findByTipo(tipo)).thenReturn(sancionList);

        List<Sancion> result = sancionService.findByTipo(tipo);

        assertThat(result).hasSize(101);
        assertThat(result.get(0).getTipo()).isEqualTo(tipo);
        verify(sancionRepository, times(1)).findByTipo(tipo);
    }

    @Test
    @DisplayName("Debe buscar sanciones por estado")
    public void shouldFindSancionesByEstado() {
        String estado = "ACTIVA";
        when(sancionRepository.findByEstado(estado)).thenReturn(sancionList);

        List<Sancion> result = sancionService.findByEstado(estado);

        assertThat(result).hasSize(101);
        assertThat(result.get(0).getEstado()).isEqualTo(estado);
        verify(sancionRepository, times(1)).findByEstado(estado);
    }

    @Test
    @DisplayName("Debe guardar sanción si el usuario está activo")
    public void shouldSaveSancionWhenUserIsActive() {
        when(userClient.findById(sancionDTO.getUsuarioId())).thenReturn(usuarioActivo);
        when(sancionRepository.save(any(Sancion.class))).thenReturn(sancionPrueba);

        Sancion result = sancionService.save(sancionDTO);

        assertThat(result).isNotNull();
        assertThat(result.getUsuarioId()).isEqualTo(1L);
        assertThat(result.getEstado()).isEqualTo("ACTIVA");
        verify(userClient, times(1)).findById(sancionDTO.getUsuarioId());
        verify(sancionRepository, times(1)).save(any(Sancion.class));
    }

    @Test
    @DisplayName("Debe lanzar excepción al guardar sanción si el usuario no está activo")
    public void shouldNotSaveSancionWhenUserIsInactive() {
        when(userClient.findById(sancionDTO.getUsuarioId())).thenReturn(usuarioInactivo);

        assertThatThrownBy(() -> sancionService.save(sancionDTO))
                .isInstanceOf(SancionException.class)
                .hasMessage("El usuario no está activo");

        verify(userClient, times(1)).findById(sancionDTO.getUsuarioId());
        verify(sancionRepository, never()).save(any(Sancion.class));
    }

    @Test
    @DisplayName("Debe actualizar sanción existente")
    public void shouldUpdateSancionById() {
        Long id = 1L;
        SancionDTO cambios = new SancionDTO();
        cambios.setUsuarioId(2L);
        cambios.setMotivo("Motivo actualizado");
        cambios.setTipo("ADVERTENCIA");
        cambios.setFechaInicio(LocalDateTime.of(2026, 7, 1, 10, 0));
        cambios.setFechaFin(LocalDateTime.of(2026, 7, 2, 10, 0));
        cambios.setEstado("FINALIZADA");

        when(sancionRepository.findById(id)).thenReturn(Optional.of(sancionPrueba));
        when(sancionRepository.save(any(Sancion.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Sancion result = sancionService.updateById(id, cambios);

        assertThat(result.getUsuarioId()).isEqualTo(2L);
        assertThat(result.getTipo()).isEqualTo("ADVERTENCIA");
        assertThat(result.getEstado()).isEqualTo("FINALIZADA");
        verify(sancionRepository, times(1)).findById(id);
        verify(sancionRepository, times(1)).save(sancionPrueba);
    }

    @Test
    @DisplayName("Debe lanzar excepción al actualizar sanción inexistente")
    public void shouldNotUpdateSancionWhenNotExists() {
        Long id = 999L;
        when(sancionRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> sancionService.updateById(id, sancionDTO))
                .isInstanceOf(SancionException.class)
                .hasMessage("Sanción no encontrada");

        verify(sancionRepository, times(1)).findById(id);
        verify(sancionRepository, never()).save(any(Sancion.class));
    }

    @Test
    @DisplayName("Debe eliminar sanción existente")
    public void shouldDeleteSancionById() {
        Long id = 1L;
        when(sancionRepository.existsById(id)).thenReturn(true);

        sancionService.deleteById(id);

        verify(sancionRepository, times(1)).existsById(id);
        verify(sancionRepository, times(1)).deleteById(id);
    }

    @Test
    @DisplayName("Debe lanzar excepción al eliminar sanción inexistente")
    public void shouldNotDeleteSancionWhenNotExists() {
        Long id = 999L;
        when(sancionRepository.existsById(id)).thenReturn(false);

        assertThatThrownBy(() -> sancionService.deleteById(id))
                .isInstanceOf(SancionException.class)
                .hasMessage("Sanción no encontrada");

        verify(sancionRepository, times(1)).existsById(id);
        verify(sancionRepository, never()).deleteById(id);
    }
}
