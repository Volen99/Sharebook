﻿namespace WorldFeed.Science.Upload.Domain.Models.Properties
{
    using Microsoft.EntityFrameworkCore;

    [Owned]
    public class Coordinates
    {
        public double Longitude { get; set; }

        public double Latitude { get; set; }

    }
}
