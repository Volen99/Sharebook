﻿namespace Chessbook.Data.Models
{
    public class UserRole
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }

        public virtual Customer User { get; set; }
        public virtual Role Role { get; set; }
    }
}