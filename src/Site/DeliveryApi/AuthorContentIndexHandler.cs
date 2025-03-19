using Umbraco.Cms.Core;
using Umbraco.Cms.Core.DeliveryApi;
using Umbraco.Cms.Core.Models;

namespace Site.DeliveryApi;

public class AuthorContentIndexHandler : IContentIndexHandler
{
    internal const string FieldName = "authorId";

    public IEnumerable<IndexFieldValue> GetFieldValues(IContent content, string? culture)
    {
        GuidUdi? authorUdi = content.GetValue<GuidUdi>("author");

        if (authorUdi is null)
        {
            return Array.Empty<IndexFieldValue>();
        }

        return new[]
        {
            new IndexFieldValue
            {
                FieldName = FieldName,
                Values = new object[] { authorUdi.Guid }
            }
        };
    }

    public IEnumerable<IndexField> GetFields() => new[]
    {
        new IndexField
        {
            FieldName = FieldName,
            FieldType = FieldType.StringRaw,
            VariesByCulture = false
        }
    };
}
