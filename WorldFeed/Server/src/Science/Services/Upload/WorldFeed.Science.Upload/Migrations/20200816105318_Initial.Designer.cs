﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using WorldFeed.Science.API.Data;

namespace WorldFeed.Science.Upload.Migrations
{
    [DbContext(typeof(ScienceUploadDbContext))]
    [Migration("20200816105318_Initial")]
    partial class Initial
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.6")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("WorldFeed.Common.Data.Message", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<bool>("Published")
                        .HasColumnType("bit");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("serializedData")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Messages");
                });

            modelBuilder.Entity("WorldFeed.Common.Models.WorldFeed.Feed", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("datetime2");

                    b.Property<DateTime?>("DeletedOn")
                        .HasColumnType("datetime2");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("bit");

                    b.Property<DateTime?>("ModifiedOn")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.ToTable("Feed");
                });

            modelBuilder.Entity("WorldFeed.Common.Models.WorldFeed.MediaEntitySize", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("Height")
                        .HasColumnType("int");

                    b.Property<string>("Resize")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("Width")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("MediaEntitySize");
                });

            modelBuilder.Entity("WorldFeed.Common.Models.WorldFeed.MediaSizeObject", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("LargeId")
                        .HasColumnType("int");

                    b.Property<int?>("MediumId")
                        .HasColumnType("int");

                    b.Property<int?>("SmallId")
                        .HasColumnType("int");

                    b.Property<int?>("ThumbId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("LargeId");

                    b.HasIndex("MediumId");

                    b.HasIndex("SmallId");

                    b.HasIndex("ThumbId");

                    b.ToTable("MediaSizeObject");
                });

            modelBuilder.Entity("WorldFeed.Science.API.Data.Models.Media", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ContentType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("datetime2");

                    b.Property<byte[]>("Data")
                        .HasColumnType("varbinary(max)");

                    b.Property<DateTime?>("DeletedOn")
                        .HasColumnType("datetime2");

                    b.Property<string>("Directory")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("DisplayUrl")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ExpandedUrl")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ExtAltText")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("ExtMediaAvailability")
                        .HasColumnType("int");

                    b.Property<string>("ExtMediaColor")
                        .HasColumnType("nvarchar(max)");

                    b.Property<long>("FeedId")
                        .HasColumnType("bigint");

                    b.Property<string>("FileExtension")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("IdStr")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Indices")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("bit");

                    b.Property<string>("MediaKey")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("MediaSizeObjectId")
                        .HasColumnType("int");

                    b.Property<string>("MediaUrl")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("MediaUrlHttps")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("ModifiedOn")
                        .HasColumnType("datetime2");

                    b.Property<string>("OriginalInfo")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Path")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("PostId")
                        .HasColumnType("int");

                    b.Property<long>("Size")
                        .HasColumnType("bigint");

                    b.Property<string>("Type")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Url")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("FeedId");

                    b.HasIndex("MediaSizeObjectId");

                    b.HasIndex("PostId");

                    b.ToTable("Media");
                });

            modelBuilder.Entity("WorldFeed.Science.API.Data.Models.Post", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("datetime2");

                    b.Property<DateTime?>("DeletedOn")
                        .HasColumnType("datetime2");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("bit");

                    b.Property<DateTime?>("ModifiedOn")
                        .HasColumnType("datetime2");

                    b.Property<int>("TextId")
                        .HasColumnType("int");

                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Post");
                });

            modelBuilder.Entity("WorldFeed.Science.API.Data.Models.Text", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Content")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("datetime2");

                    b.Property<DateTime?>("DeletedOn")
                        .HasColumnType("datetime2");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("bit");

                    b.Property<DateTime?>("ModifiedOn")
                        .HasColumnType("datetime2");

                    b.Property<int>("PostId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("PostId")
                        .IsUnique();

                    b.ToTable("Text");
                });

            modelBuilder.Entity("WorldFeed.Common.Models.WorldFeed.MediaSizeObject", b =>
                {
                    b.HasOne("WorldFeed.Common.Models.WorldFeed.MediaEntitySize", "Large")
                        .WithMany()
                        .HasForeignKey("LargeId");

                    b.HasOne("WorldFeed.Common.Models.WorldFeed.MediaEntitySize", "Medium")
                        .WithMany()
                        .HasForeignKey("MediumId");

                    b.HasOne("WorldFeed.Common.Models.WorldFeed.MediaEntitySize", "Small")
                        .WithMany()
                        .HasForeignKey("SmallId");

                    b.HasOne("WorldFeed.Common.Models.WorldFeed.MediaEntitySize", "Thumb")
                        .WithMany()
                        .HasForeignKey("ThumbId");
                });

            modelBuilder.Entity("WorldFeed.Science.API.Data.Models.Media", b =>
                {
                    b.HasOne("WorldFeed.Common.Models.WorldFeed.Feed", "Feed")
                        .WithMany()
                        .HasForeignKey("FeedId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("WorldFeed.Common.Models.WorldFeed.MediaSizeObject", "Sizes")
                        .WithMany()
                        .HasForeignKey("MediaSizeObjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("WorldFeed.Science.API.Data.Models.Post", null)
                        .WithMany("Media")
                        .HasForeignKey("PostId");
                });

            modelBuilder.Entity("WorldFeed.Science.API.Data.Models.Text", b =>
                {
                    b.HasOne("WorldFeed.Science.API.Data.Models.Post", "Post")
                        .WithOne("Text")
                        .HasForeignKey("WorldFeed.Science.API.Data.Models.Text", "PostId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
