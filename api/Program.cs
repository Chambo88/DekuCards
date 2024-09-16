using Microsoft.EntityFrameworkCore;
using DotNetEnv;
using Supabase;
using api.Services;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

Env.Load();

var url = Environment.GetEnvironmentVariable("SUPABASE_URL");
var key = Environment.GetEnvironmentVariable("SUPABASE_KEY");
string password = Environment.GetEnvironmentVariable("DB_PASSWORD") ?? "password";
string connectionString = $"Host=aws-0-ap-southeast-2.pooler.supabase.com; Password={password}; Database=postgres; Username=postgres.epygdolkqugietwkwjjl; port=5432; Timeout=50; SslMode=Disable;";
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
builder.Services.AddDbContext<SupabaseContext>(options =>
    options.UseNpgsql(connectionString).EnableSensitiveDataLogging()
           .EnableDetailedErrors());

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

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.Run();