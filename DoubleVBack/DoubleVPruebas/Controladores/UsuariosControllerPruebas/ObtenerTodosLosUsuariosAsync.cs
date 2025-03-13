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
using Microsoft.Extensions.Configuration;

namespace DoubleVPruebas.Controladores.UsuariosControllerPruebas
{
    public class ObtenerTodosLosUsuariosAsync
    {
        private readonly Mock<IUsuarioService> _mockUsuarioService;
        private readonly Mock<IMapper> _mockMapper;
        private readonly Mock<IConfiguration> _mockConfiguration;
        private readonly UsuariosController _controller;

        public ObtenerTodosLosUsuariosAsync()
        {
            _mockUsuarioService = new Mock<IUsuarioService>();
            _mockMapper = new Mock<IMapper>();
            _mockConfiguration = new Mock<IConfiguration>();

            _controller = new UsuariosController(_mockUsuarioService.Object, _mockMapper.Object, _mockConfiguration.Object);
        }

        [Fact]
        public async Task ObtenerTodosLosUsuariosAsync_CuandoHayUsuarios_DeberiaRetornarListaDeUsuarios()
        {
            // Arrange
            var usuariosMock = new List<UsuarioConRolDTO>
        {
            new UsuarioConRolDTO { UsuarioId = 1, Nombre = "Juan", Email = "juan@example.com", Password = "123", RolId = 1, RolNombre = "Admin" },
            new UsuarioConRolDTO { UsuarioId = 2, Nombre = "Maria", Email = "maria@example.com", Password = "456", RolId = 2, RolNombre = "User" }
        };

            _mockUsuarioService.Setup(s => s.ObtenerTodosLosUsuariosAsync()).ReturnsAsync(usuariosMock);

            // Act
            var resultado = await _controller.ObtenerTodosLosUsuariosAsync();

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(resultado.Result);
            var response = Assert.IsType<UsuariosConRolResponse>(actionResult.Value);
            Assert.NotNull(response.Usuarios);
            Assert.Equal(2, response.Usuarios.Count);
        }

        [Fact]
        public async Task ObtenerTodosLosUsuariosAsync_CuandoNoHayUsuarios_DeberiaRetornarMensaje()
        {
            // Arrange
            _mockUsuarioService.Setup(s => s.ObtenerTodosLosUsuariosAsync()).ReturnsAsync(new List<UsuarioConRolDTO>());

            // Act
            var resultado = await _controller.ObtenerTodosLosUsuariosAsync();

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(resultado.Result);
            var response = Assert.IsType<UsuariosConRolResponse>(actionResult.Value);
            Assert.Equal("No se encontraron usuarios", response.Message);
            Assert.Empty(response.Usuarios);
        }

        [Fact]
        public async Task ObtenerTodosLosUsuariosAsync_CuandoHayError_DeberiaRetornar500()
        {
            // Arrange
            _mockUsuarioService.Setup(s => s.ObtenerTodosLosUsuariosAsync()).ThrowsAsync(new System.Exception("Error interno"));

            // Act
            var resultado = await _controller.ObtenerTodosLosUsuariosAsync();

            // Assert
            var actionResult = Assert.IsType<ObjectResult>(resultado.Result);
            var response = Assert.IsType<UsuariosConRolResponse>(actionResult.Value);
            Assert.Equal(500, actionResult.StatusCode);
            Assert.Equal("Error interno del servidor", response.Message);
        }


    }
}
