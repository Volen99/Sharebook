﻿namespace Chessbook.Web.Api
{
    using System;
    using System.Collections.Generic;
    using System.IdentityModel.Tokens.Jwt;
    using System.Linq;
    using System.Security.Claims;
    using Microsoft.Extensions.Options;
    using Microsoft.IdentityModel.Tokens;

    using Chessbook.Data.Models;
    using Chessbook.Web.Models.AuthDTO;
    using Chessbook.Web.Api.Setup;
    using Chessbook.Services;

    public class JwtManager
    {
        private readonly JwtOptions jwtOptions;
        private readonly IUserService customerService;

        public JwtManager(IOptions<JwtOptions> jwtOptions, IUserService customerService)
        {
            this.jwtOptions = jwtOptions.Value;
            this.customerService = customerService;
        }

        public Token GenerateToken<TUser>(TUser user) where TUser : Customer
        {
            var token = new Token
            {
                Expires_in = jwtOptions.AccessValidFor.TotalMilliseconds,
                Access_token = CreateToken(user, jwtOptions.AccessExpiration, jwtOptions.AccessSigningCredentials),
                Refresh_token = CreateToken(user, jwtOptions.RefreshExpiration, jwtOptions.RefreshSigningCredentials)
            };

            return token;
        }

        private string CreateToken<TUser>(TUser user, DateTime expiration, SigningCredentials credentials) where TUser : Customer
        {
            var identity = this.GenerateClaimsIdentity(user);
            var jwt = new JwtSecurityToken(
                issuer: jwtOptions.Issuer,
                audience: jwtOptions.Audience,
                claims: identity.Claims,
                notBefore: jwtOptions.NotBefore,
                expires: expiration,
                signingCredentials: credentials);

            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            return encodedJwt;
        }

        private ClaimsIdentity GenerateClaimsIdentity<TUser>(TUser user) where TUser : Customer
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimsIdentity.DefaultNameClaimType, user.ScreenName),
            };

            var userRoles = this.customerService.GetCustomerRolesAsync(user).Result; // TODO: might bug

            if (userRoles != null)
            {
                claims.AddRange(userRoles.Select(x => new Claim("role", x.Name)));
            }

            // TODO: fix
            if (user.Claims != null)
            {
                claims.AddRange(user.Claims.Select(x => new Claim(x.ClaimType, x.ClaimValue)));
            }

            return new ClaimsIdentity(claims, "Token", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);
        }

        public ClaimsPrincipal GetPrincipal(string token, bool isAccessToken = true)
        {
            var key = new SymmetricSecurityKey(isAccessToken ? jwtOptions.AccessSecret : jwtOptions.RefreshSecret);

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidIssuer = jwtOptions.Issuer,
                ValidAudience = jwtOptions.Audience,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = key,
                RequireExpirationTime = true,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);

            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            return principal;
        }
    }
}
