using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Moq;
using Xunit;
using System.Threading.Tasks;
using DoubleV.Controllers;
using DoubleV.Modelos;
using DoubleV.Servicios;
using Microsoft.AspNetCore.Mvc;
using DoubleV.Interfaces;
using DoubleV.DTOs;
using AutoMapper;
using Xunit;
using System.Threading.Tasks;

namespace DoubleVPruebas.Controladores.TareasControllerPruebas
{
    public class CrearTarea
    {
        private readonly Mock<ITareaService> _mockTareaService;
        private readonly Mock<IMapper> _mockMapper;
        private readonly Mock<IUsuarioService> _mockUsuarioService;
        private readonly TareasController _controller;

        public CrearTarea()
        {
            _mockTareaService = new Mock<ITareaService>();
            _mockUsuarioService = new Mock<IUsuarioService>();
            _mockMapper = new Mock<IMapper>();
            _controller = new TareasController(_mockTareaService.Object, _mockUsuarioService.Object, _mockMapper.Object);
        }

        [Fact]
        public async Task CrearTarea_CuandoEsExitosa_DeberiaRetornarCreatedAtAction()
        {
            // Arrange
            var tareaDto = new TareaSinIdDTO
            {
                Descripcion = "Nueva tarea",
                UsuarioId = 1,
                Estado = "Pendiente"
            };

            var tarea = new Tarea
            {
                TareaId = 1,
                Descripcion = "Nueva tarea",
                UsuarioId = 1,
                Estado = "Pendiente"
            };

            _mockMapper.Setup(m => m.Map<Tarea>(tareaDto)).Returns(tarea);
            _mockTareaService.Setup(s => s.CrearTareaAsync(tarea)).ReturnsAsync(1); // Simula que la tarea se creó con ID 1

            // Act
            var resultado = await _controller.CrearTarea(tareaDto);

            // Assert
            var actionResult = Assert.IsType<CreatedAtActionResult>(resultado.Result);
            var response = Assert.IsType<ApiResponse>(actionResult.Value);
            Assert.Equal("Tarea creada exitosamente.", response.Message);
            Assert.Equal(1, response.Data); // La respuesta debe contener el ID de la tarea
        }

        [Fact]
        public async Task CrearTarea_CuandoFalla_DeberiaRetornarBadRequest()
        {
            // Arrange
            var tareaDto = new TareaSinIdDTO
            {
                Descripcion = "Nueva tarea",
                UsuarioId = 1,
                Estado = "Pendiente"
            };

            var tarea = new Tarea
            {
                Descripcion = "Nueva tarea",
                UsuarioId = 1,
                Estado = "Pendiente"
            };

            _mockMapper.Setup(m => m.Map<Tarea>(tareaDto)).Returns(tarea);
            _mockTareaService.Setup(s => s.CrearTareaAsync(tarea)).ReturnsAsync(-1); // Simula un error en la BD

            // Act
            var resultado = await _controller.CrearTarea(tareaDto);

            // Assert
            var actionResult = Assert.IsType<BadRequestObjectResult>(resultado.Result);
            var response = Assert.IsType<ApiResponse>(actionResult.Value);
            Assert.Equal("Fallo al crear la tarea", response.Message);
            Assert.Null(response.Data);
        }
    }
}
