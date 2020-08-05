﻿namespace WorldFeed.History.BC.Science.Data.Configurations
{
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Metadata.Builders;
    using WorldFeed.History.BC.Science.Data.Models;

    public class PostTextConfiguration : IEntityTypeConfiguration<Post>
    {
        public void Configure(EntityTypeBuilder<Post> builder)
        {
            builder
                .HasOne(p => p.Text)
                .WithOne(t => t.Post)
                .HasForeignKey<Text>(t => t.PostId); // basi maikata.. Kolko sum tup... 07.07.2020, Tuesday
        }
    }
}