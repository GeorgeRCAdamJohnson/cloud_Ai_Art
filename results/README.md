# Results Directory

This directory contains all test results, performance data, and generated outputs from the ComfyUI optimization project.

## Result Categories

### 📊 Performance Results
- `consistency-results/` - Character consistency test outputs
- `landscape-results/` - Landscape generation test results  
- `multimodel-results/` - Multi-model comparison data
- `adult-stress-results/` - Content-specific stress test data
- `mitigation-results/` - Performance degradation mitigation tests

## File Formats

### JSON Results
Each test generates detailed JSON files with:
- Performance metrics (time, steps per second)
- Quality assessments 
- Configuration details
- Timestamps and metadata

### Analysis Files
- `*_ANALYSIS.json` - Comprehensive analysis summaries
- `*_result.json` - Individual test results
- Performance charts and comparisons

## Key Metrics Tracked

### Performance Metrics
- **Generation Time**: Total seconds for completion
- **Steps per Second**: Processing efficiency
- **Pixels per Second**: Resolution-adjusted performance
- **VRAM Usage**: Memory consumption estimates

### Quality Metrics  
- **Performance Rating**: EXCELLENT/GOOD/ACCEPTABLE/SLOW
- **Quality Expectation**: Expected visual quality level
- **Resolution Stress**: Impact of resolution on performance

## Accessing Results

Results are automatically organized by:
1. **Test Type** (landscape, consistency, stress, etc.)
2. **Model Used** (SDXL Base, DreamShaperXL Turbo)
3. **Configuration** (steps, CFG, sampler settings)
4. **Timestamp** (when the test was run)

## Cleanup

Results can be safely deleted to free space - they are automatically regenerated when tests are run.