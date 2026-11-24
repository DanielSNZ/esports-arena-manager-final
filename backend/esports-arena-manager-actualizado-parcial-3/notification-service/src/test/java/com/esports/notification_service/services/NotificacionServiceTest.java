package com.esports.notification_service.services;

import com.esports.notification_service.exceptions.NotificacionException;
import com.esports.notification_service.models.Notificacion;
import com.esports.notification_service.models.dtos.NotificacionDTO;
import com.esports.notification_service.repositories.NotificacionRepository;
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
public class NotificacionServiceTest {

    @Mock
    private NotificacionRepository notificacionRepository;

    @InjectMocks
    private NotificacionServiceImpl notificacionService;

    private Notificacion notificacionPrueba;
    private NotificacionDTO notificacionDTO;
    private List<Notificacion> notificacionList;

    @BeforeEach
    public void setUp() {
        notificacionPrueba = new Notificacion();
        notificacionPrueba.setNotificacionId(1L);
        notificacionPrueba.setUsuarioId(1L);
        notificacionPrueba.setMensaje("Inscripción confirmada");
        notificacionPrueba.setTipo("INFO");
        notificacionPrueba.setFechaEnvio(LocalDateTime.of(2026, 6, 20, 10, 30));
        notificacionPrueba.setEstado("ENVIADA");

        notificacionDTO = new NotificacionDTO();
        notificacionDTO.setUsuarioId(1L);
        notificacionDTO.setMensaje("Inscripción confirmada");
        notificacionDTO.setTipo("INFO");
        notificacionDTO.setFechaEnvio(LocalDateTime.of(2026, 6, 20, 10, 30));
        notificacionDTO.setEstado("ENVIADA");

        notificacionList = new ArrayList<>();
        Faker faker = new Faker(Locale.of("es", "CL"));

        for (int i = 0; i < 100; i++) {
            Notificacion notificacion = new Notificacion();
            notificacion.setNotificacionId((long) i + 2);
            notificacion.setUsuarioId(1L);
            notificacion.setMensaje(faker.lorem().sentence());
            notificacion.setTipo("INFO");
            notificacion.setFechaEnvio(LocalDateTime.of(2026, 6, 20, 10, 30));
            notificacion.setEstado("ENVIADA");
            notificacionList.add(notificacion);
        }

        notificacionList.add(notificacionPrueba);
    }

    @Test
    @DisplayName("Debe listar todas las notificaciones")
    public void shouldFindAllNotificaciones() {
        when(notificacionRepository.findAll()).thenReturn(notificacionList);

        List<Notificacion> result = notificacionService.findAll();

        assertThat(result).hasSize(101);
        assertThat(result).contains(notificacionPrueba);
        verify(notificacionRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Debe buscar notificación por ID")
    public void shouldFindNotificacionById() {
        Long id = 1L;
        when(notificacionRepository.findById(id)).thenReturn(Optional.of(notificacionPrueba));

        Notificacion result = notificacionService.findById(id);

        assertThat(result).isNotNull();
        assertThat(result.getNotificacionId()).isEqualTo(1L);
        assertThat(result.getMensaje()).isEqualTo("Inscripción confirmada");
        verify(notificacionRepository, times(1)).findById(id);
    }

    @Test
    @DisplayName("Debe lanzar excepción al buscar notificación inexistente")
    public void shouldNotFindNotificacionById() {
        Long id = 999L;
        when(notificacionRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> notificacionService.findById(id))
                .isInstanceOf(NotificacionException.class)
                .hasMessage("Notificación no encontrada");

        verify(notificacionRepository, times(1)).findById(id);
    }

    @Test
    @DisplayName("Debe buscar notificaciones por usuarioId")
    public void shouldFindNotificacionesByUsuarioId() {
        Long usuarioId = 1L;
        when(notificacionRepository.findByUsuarioId(usuarioId)).thenReturn(notificacionList);

        List<Notificacion> result = notificacionService.findByUsuarioId(usuarioId);

        assertThat(result).hasSize(101);
        assertThat(result.get(0).getUsuarioId()).isEqualTo(usuarioId);
        verify(notificacionRepository, times(1)).findByUsuarioId(usuarioId);
    }

    @Test
    @DisplayName("Debe buscar notificaciones por tipo")
    public void shouldFindNotificacionesByTipo() {
        String tipo = "INFO";
        when(notificacionRepository.findByTipo(tipo)).thenReturn(notificacionList);

        List<Notificacion> result = notificacionService.findByTipo(tipo);

        assertThat(result).hasSize(101);
        assertThat(result.get(0).getTipo()).isEqualTo(tipo);
        verify(notificacionRepository, times(1)).findByTipo(tipo);
    }

    @Test
    @DisplayName("Debe buscar notificaciones por estado")
    public void shouldFindNotificacionesByEstado() {
        String estado = "ENVIADA";
        when(notificacionRepository.findByEstado(estado)).thenReturn(notificacionList);

        List<Notificacion> result = notificacionService.findByEstado(estado);

        assertThat(result).hasSize(101);
        assertThat(result.get(0).getEstado()).isEqualTo(estado);
        verify(notificacionRepository, times(1)).findByEstado(estado);
    }

    @Test
    @DisplayName("Debe guardar una notificación nueva")
    public void shouldSaveNotificacion() {
        when(notificacionRepository.save(any(Notificacion.class))).thenReturn(notificacionPrueba);

        Notificacion result = notificacionService.save(notificacionDTO);

        assertThat(result).isNotNull();
        assertThat(result.getMensaje()).isEqualTo("Inscripción confirmada");
        verify(notificacionRepository, times(1)).save(any(Notificacion.class));
    }

    @Test
    @DisplayName("Debe actualizar notificación existente")
    public void shouldUpdateNotificacionById() {
        Long id = 1L;
        NotificacionDTO cambios = new NotificacionDTO();
        cambios.setUsuarioId(2L);
        cambios.setMensaje("Mensaje actualizado");
        cambios.setTipo("ALERTA");
        cambios.setFechaEnvio(LocalDateTime.of(2026, 6, 21, 12, 0));
        cambios.setEstado("PENDIENTE");

        when(notificacionRepository.findById(id)).thenReturn(Optional.of(notificacionPrueba));
        when(notificacionRepository.save(any(Notificacion.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Notificacion result = notificacionService.updateById(id, cambios);

        assertThat(result.getUsuarioId()).isEqualTo(2L);
        assertThat(result.getMensaje()).isEqualTo("Mensaje actualizado");
        assertThat(result.getTipo()).isEqualTo("ALERTA");

        verify(notificacionRepository, times(1)).findById(id);
        verify(notificacionRepository, times(1)).save(notificacionPrueba);
    }

    @Test
    @DisplayName("Debe lanzar excepción al actualizar notificación inexistente")
    public void shouldNotUpdateNotificacionWhenNotExists() {
        Long id = 999L;
        when(notificacionRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> notificacionService.updateById(id, notificacionDTO))
                .isInstanceOf(NotificacionException.class)
                .hasMessage("Notificación no encontrada");

        verify(notificacionRepository, times(1)).findById(id);
        verify(notificacionRepository, never()).save(any(Notificacion.class));
    }

    @Test
    @DisplayName("Debe eliminar notificación existente")
    public void shouldDeleteNotificacionById() {
        Long id = 1L;
        when(notificacionRepository.existsById(id)).thenReturn(true);

        notificacionService.deleteById(id);

        verify(notificacionRepository, times(1)).existsById(id);
        verify(notificacionRepository, times(1)).deleteById(id);
    }

    @Test
    @DisplayName("Debe lanzar excepción al eliminar notificación inexistente")
    public void shouldNotDeleteNotificacionWhenNotExists() {
        Long id = 999L;
        when(notificacionRepository.existsById(id)).thenReturn(false);

        assertThatThrownBy(() -> notificacionService.deleteById(id))
                .isInstanceOf(NotificacionException.class)
                .hasMessage("Notificación no encontrada");

        verify(notificacionRepository, times(1)).existsById(id);
        verify(notificacionRepository, never()).deleteById(id);
    }
}
