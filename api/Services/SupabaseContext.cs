using Microsoft.EntityFrameworkCore;
using api.Models;

namespace api.Services
{
    public class SupabaseContext : DbContext
    {

        public SupabaseContext(DbContextOptions<SupabaseContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

    }
}