using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Npgsql;
using Microsoft.Extensions.Configuration;
using api.Models;

public class UserSetService
{
    private readonly string _connectionString;

    public UserSetService(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection");
    }

    // Get user's sets hierarchy
    public async Task<List<UserSet>> GetUserSetsAsync(Guid userId)
    {
        var userSets = new List<UserSet>();

        string query = @"
            SELECT *
            FROM user_sets
            WHERE user_id = @userId;";

        await using var conn = new NpgsqlConnection(_connectionString);
        await conn.OpenAsync();

        await using var cmd = new NpgsqlCommand(query, conn);
        cmd.Parameters.AddWithValue("userId", userId);

        await using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            var userSet = new UserSet
            {
                Id = reader.GetGuid(reader.GetOrdinal("id")),
                UserId = reader.GetGuid(reader.GetOrdinal("user_id")),
                SetId = reader.GetGuid(reader.GetOrdinal("set_id")),
                ParentUserSetId = reader.IsDBNull(reader.GetOrdinal("parent_user_set_id")) ? (Guid?)null : reader.GetGuid(reader.GetOrdinal("parent_user_set_id")),
                IsEditable = reader.GetBoolean(reader.GetOrdinal("is_editable")),
                CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at")),
                UpdatedAt = reader.GetDateTime(reader.GetOrdinal("updated_at"))
            };
            userSets.Add(userSet);
        }

        return userSets;
    }

    // Additional methods for adding, updating, and deleting user sets
}
