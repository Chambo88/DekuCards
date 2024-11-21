using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Npgsql;
using Microsoft.Extensions.Configuration;
using api.Models;

public class CardService
{
    private readonly string _connectionString;

    public CardService(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection");
    }

    public async Task<List<Card>> GetCardsBySetIdAsync(Guid setId)
    {
        var cards = new List<Card>();

        string query = @"
            SELECT *
            FROM cards
            WHERE set_id = @setId;";

        await using var conn = new NpgsqlConnection(_connectionString);
        await conn.OpenAsync();

        await using var cmd = new NpgsqlCommand(query, conn);
        cmd.Parameters.AddWithValue("setId", setId);

        await using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            var card = new Card
            {
                Id = reader.GetGuid(reader.GetOrdinal("id")),
                Question = reader.GetString(reader.GetOrdinal("question")),
                Answer = reader.GetString(reader.GetOrdinal("answer")),
                SetId = reader.GetGuid(reader.GetOrdinal("set_id")),
                OriginalCardId = reader.IsDBNull(reader.GetOrdinal("original_card_id")) ? (Guid?)null : reader.GetGuid(reader.GetOrdinal("original_card_id")),
                CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at")),
                UpdatedAt = reader.GetDateTime(reader.GetOrdinal("updated_at"))
            };
            cards.Add(card);
        }

        return cards;
    }

    public async Task<Guid> CreateCardAsync(Card card)
    {
        string query = @"
            INSERT INTO cards (id, question, answer, set_id, original_card_id, created_at, updated_at)
            VALUES (@id, @question, @answer, @setId, @originalCardId, @createdAt, @updatedAt);";

        card.Id = Guid.NewGuid();
        card.CreatedAt = DateTime.UtcNow;
        card.UpdatedAt = DateTime.UtcNow;

        await using var conn = new NpgsqlConnection(_connectionString);
        await conn.OpenAsync();

        await using var cmd = new NpgsqlCommand(query, conn);
        cmd.Parameters.AddWithValue("id", card.Id);
        cmd.Parameters.AddWithValue("question", card.Question);
        cmd.Parameters.AddWithValue("answer", card.Answer);
        cmd.Parameters.AddWithValue("setId", card.SetId);
        cmd.Parameters.AddWithValue("originalCardId", card.OriginalCardId ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("createdAt", card.CreatedAt);
        cmd.Parameters.AddWithValue("updatedAt", card.UpdatedAt);

        await cmd.ExecuteNonQueryAsync();

        return card.Id;
    }

    // Additional methods for updating, deleting, and retrieving cards can be implemented similarly
}
