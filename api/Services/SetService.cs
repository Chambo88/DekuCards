using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Npgsql;
using Microsoft.Extensions.Configuration;
using api.Models; // Adjust the namespace accordingly

public class SetService
{
    private readonly string _connectionString;

    public SetService(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection");
    }

    public async Task<List<Set>> GetSetsByUserIdAsync(Guid userId)
    {
        var sets = new List<Set>();

        string query = @"
            SELECT s.*
            FROM sets s
            JOIN user_sets us ON s.id = us.set_id
            WHERE us.user_id = @userId;";

        await using var conn = new NpgsqlConnection(_connectionString);
        await conn.OpenAsync();

        await using var cmd = new NpgsqlCommand(query, conn);
        cmd.Parameters.AddWithValue("userId", userId);

        await using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            var set = new Set
            {
                Id = reader.GetGuid(reader.GetOrdinal("id")),
                Name = reader.GetString(reader.GetOrdinal("name")),
                Description = reader.GetString(reader.GetOrdinal("description")),
                CreatedBy = reader.GetGuid(reader.GetOrdinal("created_by")),
                IsPublic = reader.GetBoolean(reader.GetOrdinal("is_public")),
                OriginalSetId = reader.IsDBNull(reader.GetOrdinal("original_set_id")) ? (Guid?)null : reader.GetGuid(reader.GetOrdinal("original_set_id")),
                CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at")),
                UpdatedAt = reader.GetDateTime(reader.GetOrdinal("updated_at"))
            };
            sets.Add(set);
        }

        return sets;
    }

    // Create a new set
    public async Task<Guid> CreateSetAsync(Set set)
    {
        string query = @"
            INSERT INTO sets (id, name, description, created_by, is_public, original_set_id, created_at, updated_at)
            VALUES (@id, @name, @description, @createdBy, @isPublic, @originalSetId, @createdAt, @updatedAt);";

        set.Id = Guid.NewGuid();
        set.CreatedAt = DateTime.UtcNow;
        set.UpdatedAt = DateTime.UtcNow;

        await using var conn = new NpgsqlConnection(_connectionString);
        await conn.OpenAsync();

        await using var cmd = new NpgsqlCommand(query, conn);
        cmd.Parameters.AddWithValue("id", set.Id);
        cmd.Parameters.AddWithValue("name", set.Name);
        cmd.Parameters.AddWithValue("description", set.Description ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("createdBy", set.CreatedBy);
        cmd.Parameters.AddWithValue("isPublic", set.IsPublic);
        cmd.Parameters.AddWithValue("originalSetId", set.OriginalSetId ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("createdAt", set.CreatedAt);
        cmd.Parameters.AddWithValue("updatedAt", set.UpdatedAt);

        await cmd.ExecuteNonQueryAsync();

        return set.Id;
    }

    // Additional methods for updating, deleting, and retrieving sets can be implemented similarly
}
