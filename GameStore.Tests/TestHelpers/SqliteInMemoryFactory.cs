// TestHelpers/SqliteInMemoryFactory.cs
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using System;

public static class SqliteInMemoryFactory
{
    // Crea y abre una conexión sqlite in-memory.
    public static SqliteConnection CreateOpenConnection()
    {
        var connection = new SqliteConnection("DataSource=:memory:");
        connection.Open(); // Mantener abierta para que la DB exista mientras la uses
        return connection;
    }

    // Crea opciones para un DbContext concreto usando la misma conexión
    public static DbContextOptions<TContext> CreateOptions<TContext>(SqliteConnection connection) where TContext : DbContext
    {
        return new DbContextOptionsBuilder<TContext>()
            .UseSqlite(connection)
            .Options;
    }

    // Inicializa (EnsureCreated) ambos contextos usando la misma conexión
    public static void InitializeDatabases(SqliteConnection connection, params DbContext[] contexts)
    {
        foreach (var ctx in contexts)
        {
            ctx.Database.EnsureCreated();
        }
    }
}
