using DoubleV;
using DoubleV.Interfaces;
using DoubleV.Mapping;
using DoubleV.Modelos;
using DoubleV.Servicios;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using AutoMapper;
using KontrolarCloud.Middlewares;
using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

IConfiguration configuration = builder.Configuration;


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowOrigins",
        builder => builder.WithOrigins("http://localhost:4200")
                          .AllowAnyHeader()
        .AllowAnyMethod());
});

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.MigrationsAssembly("DoubleV")
    ),
    ServiceLifetime.Transient
);

builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<ITareaService, TareaService>();
builder.Services.AddScoped<IRolService, RolService>();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "DoubleV", Version = "v1" });

    // Configuraci�n para el token de autenticaci�n en Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = @"JWT Authorization header using the Bearer scheme. \r\n\r\n 
                      Enter 'Bearer' [space] and then your token in the text input below.
                      \r\n\r\nExample: 'Bearer 12345abcdef'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header,

            },
            new List<string>()
        }
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        IConfiguration configuration = builder.Configuration;

        if (configuration != null)
        {
            options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = configuration["Jwt:Issuer"],
                ValidAudience = configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]))
            };
        }
        else
        {
            throw new InvalidOperationException("Configuration is null.");
        }
    });

builder.Services.AddHttpContextAccessor();

builder.Services.AddAutoMapper(typeof(MappingTarea));
builder.Services.AddAutoMapper(typeof(MappingUsuario));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "DoubleV v1"));
}

app.UseHttpsRedirection();

app.UseRouting();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseCors("AllowOrigins");

app.UseMiddleware<TokenValidationMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
