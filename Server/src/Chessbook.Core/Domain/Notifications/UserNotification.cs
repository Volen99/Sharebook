﻿using System;
using Chessbook.Data.Models;

namespace Chessbook.Core.Domain.Notifications
{
    public class UserNotification : BaseEntity
    {
        public UserNotificationType Type { get; set; }

        public int UserId { get; set; }
        public Customer User { get; set; }

        public int? PostId { get; set; }
        public Data.Models.Post.Post Post { get; set; }

        public int? RelationshipId { get; set; }
        public Relationship Relationship { get; set; }

        public bool Read { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}