# Developer Notes

## Architecture Decisions

### Server-side API Proxy

- **Why**: Protects WaniKani API key from client exposure
- **Implementation**: Next.js API route handles all WaniKani communication
- **Benefits**: Rate limiting, retry logic, and error handling on server

### In-memory Caching

- **Why**: Enables offline study once data is loaded
- **Implementation**: React state stores fetched cards
- **Benefits**: No additional storage complexity, works offline

### Keyboard-first UX

- **Why**: Efficient studying workflow
- **Implementation**: Global keyboard event listeners
- **Benefits**: Power user friendly, accessible

### Single API Call Per Level

- **Why**: Simpler state management, better performance
- **Implementation**: Fetch all subjects for level at once
- **Benefits**: No incremental loading complexity

## API Structure

### WaniKani API Integration

- **Endpoint**: `/v2/subjects`
- **Pagination**: Automatic handling via `next_url`
- **Rate Limiting**: 60 requests/minute, exponential backoff
- **Filtering**: By level and subject type

### Data Transformation

- **Input**: WaniKani Subject objects
- **Output**: Internal Card format
- **Mapping**:
  - `characters` → `character`
  - `meanings[].meaning` → `meanings[]`
  - `readings[].reading` → `readings[]`
  - `context_sentences` → `examples[]`

## Future Enhancements

### Potential Features

1. **SRS Integration**: Add spaced repetition scheduling
2. **Progress Tracking**: Save study progress locally
3. **Custom Decks**: Create custom card combinations
4. **Audio Support**: Play pronunciation audio
5. **Study Statistics**: Track study time and accuracy

### Technical Improvements

1. **Service Worker**: Better offline caching
2. **IndexedDB**: Persistent local storage
3. **PWA Support**: Install as app
4. **Advanced Filtering**: By difficulty, SRS stage
5. **Bulk Operations**: Study multiple levels

## Testing Strategy

### Unit Tests

- **Data Transformation**: Verify WaniKani → Card mapping
- **Export Functions**: Test CSV/JSON generation
- **Utility Functions**: Edge case handling

### Integration Tests

- **API Proxy**: Mock WaniKani responses
- **Component Behavior**: User interactions
- **Error Handling**: Network failures

### E2E Tests (Future)

- **User Flows**: Complete study sessions
- **Export Workflows**: Download and verify files
- **Keyboard Navigation**: All shortcuts work

## Performance Considerations

### Bundle Size

- **Tree Shaking**: Only import used functions
- **Code Splitting**: Lazy load level pages
- **Image Optimization**: Next.js Image component

### Runtime Performance

- **Memoization**: Prevent unnecessary re-renders
- **Virtual Scrolling**: For large card sets (future)
- **Debouncing**: API calls and user input

## Security Notes

### API Key Protection

- **Server-only**: Never expose to client
- **Environment Variables**: Use `.env.local`
- **Rate Limiting**: Prevent abuse

### Data Privacy

- **No Storage**: Cards not persisted
- **Local Only**: All data stays in browser
- **No Analytics**: No user tracking

## Deployment

### Environment Setup

1. Set `WANIKANI_API_KEY` in production
2. Configure domain for CORS if needed
3. Set up monitoring for API failures

### Build Optimization

- **Static Generation**: Pre-build level pages
- **CDN**: Cache API responses
- **Compression**: Gzip/Brotli assets
