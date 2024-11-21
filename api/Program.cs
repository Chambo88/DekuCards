using Microsoft.EntityFrameworkCore;
using DotNetEnv;
using Supabase;
using api.Services;
using Npgsql;
using Microsoft.VisualBasic;

var builder = WebApplication.CreateBuilder(args);

Env.Load();
var url = Environment.GetEnvironmentVariable("SUPABASE_URL");
var key = Environment.GetEnvironmentVariable("SUPABASE_KEY");
var options = new SupabaseOptions
{
    AutoRefreshToken = true,
    AutoConnectRealtime = true,
    // SessionHandler = new SupabaseSessionHandler() <-- This must be implemented by the developer
};

builder.Services.AddScoped(provider => new Client(url, key, options));
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<SetService>();
builder.Services.AddScoped<CardService>();
builder.Services.AddScoped<UserSetService>();


var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<SupabaseContext>();
    try
    {
        bool canConnect = context.Database.CanConnect();
        Console.WriteLine($"Database connection successful: {canConnect}");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database connection failed: {ex.Message}");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.Run();