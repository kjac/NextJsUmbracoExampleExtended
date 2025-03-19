using Umbraco.Cms.Core.DeliveryApi;

namespace Site.DeliveryApi;

public class AuthorFilterHandler : IFilterHandler
{
    private const string FilterSpecifier = "author:";

    public bool CanHandle(string query)
        => query.StartsWith(FilterSpecifier, StringComparison.OrdinalIgnoreCase);

    public FilterOption BuildFilterOption(string filter)
    {
        var fieldValue = filter[FilterSpecifier.Length..];

        // there might be several values for the filter
        var values = fieldValue.Split(',');

        return new FilterOption
        {
            FieldName = AuthorContentIndexHandler.FieldName,
            Values = values,
            Operator = FilterOperation.Is
        };
    }
}
