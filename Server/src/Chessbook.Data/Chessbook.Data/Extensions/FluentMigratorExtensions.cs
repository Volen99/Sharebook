﻿using System.Data;
using FluentMigrator.Builders.Alter.Table;
using FluentMigrator.Builders.Create.Table;

using Chessbook.Data.Mapping;
using Chessbook.Data.Models;

namespace Chessbook.Data.Extensions
{
    /// <summary>
    /// FluentMigrator extensions
    /// </summary>
    public static class FluentMigratorExtensions
    {
        /// <summary>
        /// Specifies a foreign key
        /// </summary>
        /// <param name="column">The foreign key column</param>
        /// <param name="primaryTableName">The primary table name</param>
        /// <param name="primaryColumnName">The primary tables column name</param>
        /// <param name="onDelete">Behavior for DELETEs</param>
        /// <typeparam name="TPrimary"></typeparam>
        /// <returns>Set column options or create a new column or set a foreign key cascade rule</returns>
        public static ICreateTableColumnOptionOrForeignKeyCascadeOrWithColumnSyntax ForeignKey<TPrimary>(this ICreateTableColumnOptionOrWithColumnSyntax column, string primaryTableName = null, string primaryColumnName = null, Rule onDelete=Rule.Cascade) where TPrimary : BaseEntity
        {
            if (string.IsNullOrEmpty(primaryTableName))
            {
                primaryTableName = NameCompatibilityManager.GetTableName(typeof(TPrimary));
            }

            if (string.IsNullOrEmpty(primaryColumnName))
            {
                primaryColumnName = nameof(BaseEntity.Id);
            }

            return column.Indexed().ForeignKey(primaryTableName, primaryColumnName).OnDelete(onDelete);
        }

        /// <summary>
        /// Specifies a foreign key
        /// </summary>
        /// <param name="column">The foreign key column</param>
        /// <param name="primaryTableName">The primary table name</param>
        /// <param name="primaryColumnName">The primary tables column name</param>
        /// <param name="onDelete">Behavior for DELETEs</param>
        /// <typeparam name="TPrimary"></typeparam>
        /// <returns>Alter/add a column with an optional foreign key</returns>
        public static IAlterTableColumnOptionOrAddColumnOrAlterColumnOrForeignKeyCascadeSyntax ForeignKey<TPrimary>(this IAlterTableColumnOptionOrAddColumnOrAlterColumnSyntax column, string primaryTableName = null, string primaryColumnName = null, Rule onDelete = Rule.Cascade) where TPrimary : BaseEntity
        {
            if (string.IsNullOrEmpty(primaryTableName))
            {
                primaryTableName = NameCompatibilityManager.GetTableName(typeof(TPrimary));
            }

            if (string.IsNullOrEmpty(primaryColumnName))
            {
                primaryColumnName = nameof(BaseEntity.Id);
            }

            return column.Indexed().ForeignKey(primaryTableName, primaryColumnName).OnDelete(onDelete);
        }
    }
}
